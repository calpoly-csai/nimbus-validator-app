import React from 'react'

export default function TokenCreator({ onDismiss }) {

    return (<div className="TokenCreator">
        <div className="modal-background" onClick={onDismiss}>
        <div className="modal">
            <h2>Token Creator</h2>
            <p>In the future, you'll be able to create your own tokens, but not right now :)</p>
            </div>
        </div>


    </div>)

}