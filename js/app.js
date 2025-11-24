;(function(){
  const rootEl = document.getElementById('react-root')
  if (!rootEl || !window.React || !window.ReactDOM) return
  const e = window.React.createElement
function Header(){
    return null
  }
  const root = window.ReactDOM.createRoot(rootEl)
  root.render(e(Header))
})()


