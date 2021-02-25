import React from 'react'
import { connect } from "react-redux";

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (props.notification !== '')
    return(
      <div style={style}>
        {props.notification}
      </div>
    )
  else
    return(<div/>)

}

const mapStateToProps = (state) => {
  return{
    notification: state.notification.message
  }
}

export default connect(mapStateToProps)(Notification)