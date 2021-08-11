import ReactDOM from 'react-dom'

export default function MapPopupPortal({ domNode, children }) {
  if (!domNode) {
    return null
  }
  return ReactDOM.createPortal(children, domNode)
}
