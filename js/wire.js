import { createFSM } from '/core/fsm/index.js'
import { byId } from '/core/symbols/index.js'
import { LINES_9 } from '/core/paylines/index.js'

const idToSrc = (id) => `/${id}.png`
const PLACEHOLDER_SRC = '/questionmark.png'
const PLACEHOLDER_ALT = 'Mystery symbol'
const NEAR_MISS_DURATION = 420
const SETTINGS_KEY = 'bmr.settings'
const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
const DEFAULT_SETTINGS = {
    muted: false,
    volume: 75,
    reducedMotion: prefersReducedMotion,
    highContrast: false,
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const PAYLINE_NAMESPACE = 'http://www.w3.org/2000/svg'
const confettiColors = ['#f5d970', '#c18727', '#f7f1c9', '#e6b97e', '#8c5a20']

const confettiOverlay = typeof document !== 'undefined' ? document.getElementById('confetti-overlay') : null
const confettiCanvas = confettiOverlay?.querySelector('canvas')
const confettiCtx = confettiCanvas?.getContext('2d')
let confettiParticles = []
let confettiAnimationId = null
let confettiTimeout = null

const bodyElement = typeof document !== 'undefined' ? document.body : null
const MOOD_CLASSES = ['mood-win', 'mood-near-miss']
let moodTimer = null

const statsState = { spins: 0, hits: 0, streak: 0, biggestWin: 0 }
let statsElements = null

function pulseMood(className, duration = 1400) {
    if (!bodyElement) return
    MOOD_CLASSES.forEach((cls) => bodyElement.classList.remove(cls))
    bodyElement.classList.add(className)
    if (moodTimer) clearTimeout(moodTimer)
    moodTimer = window.setTimeout(() => {
        bodyElement?.classList.remove(className)
        moodTimer = null
    }, duration)
}

function updateStatsElements() {
    if (!statsElements) return
    statsElements.spins.textContent = String(statsState.spins)
    const hitRate = statsState.spins ? Math.round((statsState.hits / statsState.spins) * 100) : 0
    statsElements.hitRate.textContent = `${hitRate}%`
    statsElements.streak.textContent = String(statsState.streak)
    statsElements.bigWin.textContent = `$${statsState.biggestWin}`
}

function resizeConfettiCanvas() {
    if (!confettiCanvas) return
    confettiCanvas.width = window.innerWidth
    confettiCanvas.height = window.innerHeight
}

function createConfettiParticle() {
    if (!confettiCanvas) return null
    return {
        x: Math.random() * confettiCanvas.width,
        y: -10,
        size: Math.random() * 8 + 6,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 2 * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    }
}

function renderConfetti() {
    if (!confettiCtx || !confettiCanvas) return
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height)
    confettiParticles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.rotation += p.rotationSpeed
        confettiCtx.save()
        confettiCtx.translate(p.x, p.y)
        confettiCtx.rotate(p.rotation)
        confettiCtx.fillStyle = p.color
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        confettiCtx.restore()
    })
    confettiParticles = confettiParticles.filter((p) => p.y < confettiCanvas.height + 20)
    while (confettiParticles.length < 120) {
        const particle = createConfettiParticle()
        if (particle) confettiParticles.push(particle)
    }
    confettiAnimationId = requestAnimationFrame(renderConfetti)
}

function startConfetti(duration = 2200) {
    if (!confettiCtx || !confettiOverlay) return
    confettiOverlay.classList.add('active')
    resizeConfettiCanvas()
    if (!confettiAnimationId) {
        confettiParticles = Array.from({ length: 80 }, () => createConfettiParticle()).filter(Boolean)
        renderConfetti()
    }
    if (confettiTimeout) clearTimeout(confettiTimeout)
    confettiTimeout = window.setTimeout(stopConfetti, duration)
}

function stopConfetti() {
    if (!confettiCtx || !confettiOverlay) return
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId)
        confettiAnimationId = null
    }
    confettiParticles = []
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height)
    confettiOverlay.classList.remove('active')
}

if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
        resizeConfettiCanvas()
    })
}
const REEL_LOOP_SRC = '/sounds/slot-machine-reels-sound-30276.mp3'
const PAYOUT_SRC = '/sounds/slot-machine-payout-81725.mp3'

function createAudio(src, { loop = false } = {}) {
    const audio = new Audio(src)
    audio.loop = loop
    audio.preload = 'auto'
    return audio
}

const reelLoopAudio = createAudio(REEL_LOOP_SRC, { loop: true })
const payoutAudio = createAudio(PAYOUT_SRC)

function syncAudioSettings() {
    const level = Math.max(0, Math.min(1, (settingsState.volume ?? DEFAULT_SETTINGS.volume) / 100))
    ;[reelLoopAudio, payoutAudio].forEach((audio) => {
        audio.volume = level
        audio.muted = Boolean(settingsState.muted)
    })
}

function startReelLoop() {
    if (settingsState?.muted) return null
    try {
        reelLoopAudio.currentTime = 2
        reelLoopAudio.play()
    } catch {
        // ignore autoplay restrictions
    }
    return reelLoopAudio
}

function stopReelLoop(loopAudio) {
    if (!loopAudio) return
    loopAudio.pause()
    loopAudio.currentTime = 0
}

function playPayoutSoundFile() {
    try {
        payoutAudio.currentTime = 0
        payoutAudio.play()
    } catch {
        // ignore
    }
}

let audioContext = null
function ensureAudioContext() {
    if (audioContext) return audioContext
    if (typeof window === 'undefined') return null
    const ctor = window.AudioContext || window.webkitAudioContext
    if (!ctor) return null
    audioContext = new ctor()
    return audioContext
}

function playTone({ frequency = 440, duration = 0.2, type = 'sine', attack = 0.02 } = {}) {
    if (settingsState?.muted) return
    const ctx = ensureAudioContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.value = Math.max(0, Math.min(1, (settingsState.volume || 75) / 100)) * 0.4
    osc.connect(gain)
    gain.connect(ctx.destination)
    const now = ctx.currentTime
    const effectiveAttack = Math.min(attack, duration * 0.4)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(gain.gain.value, now + effectiveAttack)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    osc.start(now)
    osc.stop(now + duration + 0.05)
}

function playStopSound() {
    playTone({ frequency: 320, duration: 0.25, type: 'sine', attack: 0.04 })
}

function playLineChime() {
    playTone({ frequency: 760, duration: 0.16, type: 'triangle' })
}

async function playFanfare() {
    if (settingsState?.muted) return
    const notes = [520, 620, 780]
    for (const freq of notes) {
        playTone({ frequency: freq, duration: 0.16, type: 'sine' })
        await delay(120)
    }
}

function clampNumber(value, min, max, fallback) {
    const num = Number(value)
    if (!Number.isFinite(num)) return fallback
    return Math.min(max, Math.max(min, num))
}

function readSettingsFromStorage() {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_SETTINGS }
    try {
        const stored = localStorage.getItem(SETTINGS_KEY)
        if (!stored) return { ...DEFAULT_SETTINGS }
        const parsed = JSON.parse(stored)
        return {
            muted: typeof parsed?.muted === 'boolean' ? parsed.muted : DEFAULT_SETTINGS.muted,
            volume: clampNumber(parsed?.volume, 0, 100, DEFAULT_SETTINGS.volume),
            reducedMotion: typeof parsed?.reducedMotion === 'boolean' ? parsed.reducedMotion : DEFAULT_SETTINGS.reducedMotion,
            highContrast: typeof parsed?.highContrast === 'boolean' ? parsed.highContrast : DEFAULT_SETTINGS.highContrast,
        }
    } catch {
        return { ...DEFAULT_SETTINGS }
    }
}

function writeSettingsToStorage(state) {
    if (typeof localStorage === 'undefined') return
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(state))
    } catch {
        // ignore
    }
}

let settingsState = readSettingsFromStorage()
let settingsControls = null

function applySettingsToDOM() {
    document.documentElement.classList.toggle('reduced-motion', settingsState.reducedMotion)
    document.documentElement.classList.toggle('high-contrast', settingsState.highContrast)
    document.documentElement.dataset.audioMuted = settingsState.muted ? 'true' : 'false'
    document.documentElement.dataset.audioVolume = String(settingsState.volume)
}

function syncSettingsControls() {
    if (!settingsControls) return
    const { muteInput, volumeInput, volumeOutput, reducedMotionInput, highContrastInput } = settingsControls
    if (muteInput) muteInput.checked = settingsState.muted
    if (volumeInput) {
        volumeInput.value = settingsState.volume
        volumeInput.disabled = settingsState.muted
    }
    if (volumeOutput) volumeOutput.textContent = `${settingsState.volume}%`
    if (reducedMotionInput) reducedMotionInput.checked = settingsState.reducedMotion
    if (highContrastInput) highContrastInput.checked = settingsState.highContrast
}

function updateSettingsState(changes) {
    settingsState = { ...settingsState, ...changes }
    writeSettingsToStorage(settingsState)
    applySettingsToDOM()
    syncSettingsControls()
    syncAudioSettings()
}

applySettingsToDOM()
syncAudioSettings()

const FULL_SPIN_DURATION = 1500
const REEL_STOP_GAP = 450

function init() {
    let fsm = createFSM({ initialBalance: 1000, lines: 1, betPerLine: 1 })

    const el = {
        reelColumns: Array.from(document.querySelectorAll('.reel-column')),
        reelsWrapper: document.querySelector('.reels-wrapper'),
        spin: document.querySelector('.spin'),
        reset: document.querySelector('.reset'),
        balance: document.querySelector('.balance'),
        winner: document.querySelector('.winner'),
        betTotal: document.querySelector('.bet-total'),
        lineButtons: Array.from(document.querySelectorAll('.option--lines')),
        betButtons: Array.from(document.querySelectorAll('.option--bet')),
        lineCallout: document.querySelector('.line-callout'),
    }
    const statsEls = {
        spins: document.querySelector('[data-stat="spins"]'),
        hitRate: document.querySelector('[data-stat="hitRate"]'),
        streak: document.querySelector('[data-stat="streak"]'),
        bigWin: document.querySelector('[data-stat="bigWin"]'),
    }
    statsElements = statsEls
    updateStatsElements()

    const settingsTrigger = document.querySelector('.settings-trigger')
    const settingsModal = document.querySelector('.settings-modal')
    const settingsCloseButtons = settingsModal
        ? Array.from(settingsModal.querySelectorAll('[data-action="close-settings"]'))
        : []
    const muteInput = document.getElementById('setting-mute')
    const volumeInput = document.getElementById('setting-volume')
    const volumeOutput = document.getElementById('setting-volume-value')
    const reducedMotionInput = document.getElementById('setting-reduced-motion')
    const highContrastInput = document.getElementById('setting-high-contrast')

    if (settingsModal) {
        settingsModal.hidden = true
        settingsModal.setAttribute('aria-hidden', 'true')
    }

    settingsControls = { muteInput, volumeInput, volumeOutput, reducedMotionInput, highContrastInput }
    syncSettingsControls()

    function toggleSettingsModal(open) {
        if (!settingsModal) return
        settingsModal.hidden = !open
        settingsModal.setAttribute('aria-hidden', open ? 'false' : 'true')
        if (open) {
            settingsModal.querySelector('.settings-modal__close')?.focus()
        } else {
            settingsTrigger?.focus()
        }
    }

    settingsTrigger?.addEventListener('click', () => toggleSettingsModal(true))
    settingsCloseButtons.forEach((button) => button.addEventListener('click', () => toggleSettingsModal(false)))
    settingsModal?.addEventListener('click', (event) => {
        if (event.target === settingsModal) toggleSettingsModal(false)
    })
    settingsModal?.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault()
            toggleSettingsModal(false)
        }
    })

    muteInput?.addEventListener('change', () => updateSettingsState({ muted: muteInput.checked }))
    volumeInput?.addEventListener('input', () => {
        const volume = clampNumber(volumeInput.value, 0, 100, settingsState.volume)
        updateSettingsState({ volume })
    })
    reducedMotionInput?.addEventListener('change', () => updateSettingsState({ reducedMotion: reducedMotionInput.checked }))
    highContrastInput?.addEventListener('change', () => updateSettingsState({ highContrast: highContrastInput.checked }))

    const reelCells = el.reelColumns.map((column) => {
        const cells = Array.from(column.querySelectorAll('img[data-cell]'))
        if (cells.length !== 3) throw new Error('Each reel column requires 3 symbol cells')
        return cells
    })

    const paylineSvg = document.querySelector('.payline-overlay svg')
    const paylineLines = paylineSvg
        ? LINES_9.map((line, index) => {
            const path = document.createElementNS(PAYLINE_NAMESPACE, 'path')
            path.dataset.lineIndex = String(index)
            path.dataset.active = 'false'
            path.classList.add('payline-line')
            paylineSvg.appendChild(path)
            return { line, path }
        })
        : []
    let paylineLayoutPending = false
    let lineCalloutTimeout = null
    const lineCallout = el.lineCallout

    function layoutPaylines() {
        if (!paylineSvg || paylineLines.length === 0) return
        const wrapperRect = el.reelsWrapper?.getBoundingClientRect()
        if (!wrapperRect) return
        paylineSvg.setAttribute('viewBox', `0 0 ${wrapperRect.width} ${wrapperRect.height}`)
        const centers = reelCells.map((cells) => cells.map((img) => {
            const rect = img.getBoundingClientRect()
            return {
                x: rect.left - wrapperRect.left + rect.width / 2,
                y: rect.top - wrapperRect.top + rect.height / 2,
            }
        }))
        paylineLines.forEach(({ line, path }) => {
            const commands = []
            for (let i = 0; i < line.length; i += 1) {
                const [row, col] = line[i]
                const point = centers[col]?.[row]
                if (!point) continue
                const prefix = i === 0 ? 'M' : 'L'
                commands.push(`${prefix}${point.x},${point.y}`)
            }
            if (commands.length === 0) return
            path.setAttribute('d', commands.join(''))
        })
    }

    function schedulePaylineLayout() {
        if (paylineLayoutPending) return
        paylineLayoutPending = true
        requestAnimationFrame(() => {
            layoutPaylines()
            paylineLayoutPending = false
        })
    }

    function clearLineCallout() {
        if (!lineCallout) return
        lineCallout.textContent = ''
        if (lineCalloutTimeout) {
            clearTimeout(lineCalloutTimeout)
            lineCalloutTimeout = null
        }
    }

    function updateLineCallout(text, timeout = 0) {
        if (!lineCallout) return
        lineCallout.textContent = text
        if (lineCalloutTimeout) {
            clearTimeout(lineCalloutTimeout)
            lineCalloutTimeout = null
        }
        if (timeout > 0) {
            lineCalloutTimeout = window.setTimeout(() => {
                lineCallout.textContent = ''
                lineCalloutTimeout = null
            }, timeout)
        }
    }

    function setActiveLines(indices = []) {
        const activeSet = new Set(indices)
        paylineLines.forEach(({ path }) => {
            const lineIndex = Number(path.dataset.lineIndex)
            path.dataset.active = activeSet.has(lineIndex) ? 'true' : 'false'
        })
    }

    async function animateWinningLines(results = [], total = 0) {
        if (paylineLines.length === 0) return
        setActiveLines([])
        clearLineCallout()
        if (results.length === 0) return
        for (const result of results) {
            setActiveLines([result.lineIndex])
            updateLineCallout(`Line ${result.lineIndex + 1}: +$${result.amount}`)
            playLineChime()
            await delay(420)
        }
        const winners = [...new Set(results.map((item) => item.lineIndex))]
        setActiveLines(winners)
        if (total > 0) {
            startConfetti()
            pulseMood('mood-win', 1600)
            updateLineCallout(`Total win: $${total}`, 1200)
            playPayoutSoundFile()
            await playFanfare()
        }
    }

    window.addEventListener('resize', schedulePaylineLayout)
    schedulePaylineLayout()

    function setColumnSymbols(reelIndex, symbols) {
        const cells = reelCells[reelIndex]
        cells.forEach((img, rowIndex) => {
            const symbolId = symbols?.[rowIndex]
            if (symbolId) {
                const meta = byId(symbolId)
                img.src = idToSrc(symbolId)
                img.alt = meta ? meta.label : 'Slot symbol'
            } else {
                img.src = PLACEHOLDER_SRC
                img.alt = PLACEHOLDER_ALT
            }
        })
    }

    function resetGrid() {
        for (let i = 0; i < reelCells.length; i += 1) {
            setColumnSymbols(i, null)
        }
    }

    function setPressed(buttons, key, value) {
        buttons.forEach((button) => {
            const buttonValue = Number(button.dataset[key])
            const isActive = buttonValue === value
            button.setAttribute('aria-pressed', String(isActive))
        })
    }

    function updateBetDisplay() {
        const total = fsm.betPerLine * fsm.lines
        el.betTotal.innerText = `Total Bet: $${total}`
        setPressed(el.lineButtons, 'lines', fsm.lines)
        setPressed(el.betButtons, 'bet', fsm.betPerLine)
    }

    function updateBalance() {
        el.balance.innerText = `Balance: $${fsm.balance}`
        const canSpin = fsm.balance >= (fsm.betPerLine * fsm.lines)
        el.spin.disabled = !canSpin
        updateBetDisplay()
    }

    function handleNearMiss(grid, totalWin) {
        if (totalWin > 0) return
        const centerSymbols = grid.map((column) => column[1])
        const matches = new Map()
        centerSymbols.forEach((symbolId, reelIndex) => {
            if (!matches.has(symbolId)) matches.set(symbolId, [])
            matches.get(symbolId).push(reelIndex)
        })
        let highlighted = false
        matches.forEach((indices) => {
            if (indices.length >= 2) {
                highlighted = true
                indices.forEach((idx) => el.reelColumns[idx].classList.add('near-miss'))
            }
        })
        if (highlighted) {
            setTimeout(() => {
                matches.forEach((indices) => {
                    if (indices.length >= 2) {
                        indices.forEach((idx) => el.reelColumns[idx].classList.remove('near-miss'))
                    }
                })
            }, NEAR_MISS_DURATION)
            pulseMood('mood-near-miss', NEAR_MISS_DURATION)
        }
    }

    el.lineButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const lines = Number(button.dataset.lines)
            if (!Number.isFinite(lines) || lines === fsm.lines) return
            fsm.setBet({ lines })
            updateBalance()
        })
    })

    el.betButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const bet = Number(button.dataset.bet)
            if (!Number.isFinite(bet) || bet === fsm.betPerLine) return
            fsm.setBet({ betPerLine: bet })
            updateBalance()
        })
    })

    el.reset.addEventListener('click', () => {
        fsm = createFSM({ initialBalance: 1000, lines: 1, betPerLine: 1 })
        el.winner.innerText = ''
        resetGrid()
        updateBalance()
    })

    el.spin.addEventListener('click', async () => {
        let spinLoop = null
        try {
            spinLoop = startReelLoop()
            el.reelColumns.forEach((column, index) => {
                column.classList.add('spinning')
                column.classList.remove('stop-overshoot')
                column.classList.remove('near-miss')
                setColumnSymbols(index, null)
            })

            const { grid, result } = fsm.spinOnce()
            statsState.spins += 1
            if (result.total > 0) {
                statsState.hits += 1
                statsState.streak += 1
                statsState.biggestWin = Math.max(statsState.biggestWin, result.total)
            } else {
                statsState.streak = 0
            }
            updateStatsElements()
            await delay(FULL_SPIN_DURATION)
            for (let i = 0; i < el.reelColumns.length; i += 1) {
                setColumnSymbols(i, grid[i])
                el.reelColumns[i].classList.remove('spinning')
                el.reelColumns[i].classList.add('stop-overshoot')
                playStopSound()
                await delay(REEL_STOP_GAP)
            }

            updateBalance()
            handleNearMiss(grid, result.total)
            await animateWinningLines(result.results, result.total)
            el.winner.innerText = result.total > 0
                ? `You Win!! +$${result.total}`
                : 'Try again, Winning is in your future!!'
        } catch {
            el.winner.innerText = 'Insufficient balance to spin.'
        } finally {
            stopReelLoop(spinLoop)
        }
    })

    updateBalance()
    resetGrid()
}

document.addEventListener('DOMContentLoaded', init)
