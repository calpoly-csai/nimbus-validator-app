import React, { useEffect, useRef } from 'react';
import './LoginHero.scss';

const dist = 250

function randomDist() {
    return `${(Math.random() * 2 - 1) * dist}px`
}

export default function LoginHero() {
    let messages = ["Hello Nimbus"];
    let index = 0
    let messageRef = useRef(null)
    let currentMessage = messages[index].split('').map((char, i) => <span className='letter' style={{
        display: `${char === ' ' ? 'initial' : ''}`
    }} key={i} > {char}</ span >)

    let animateLetters = () => {
        let letters = [...messageRef.current.children]
        letters.forEach(letter => {
            // animate each individual span element (character)
            let keyframes = {
                transform: [`translate(${randomDist()}, ${randomDist()})`,
                    `translate(0, 0)`],
                opacity: ['0.2', '1']
            }
            letter.animate(keyframes, { duration: 2000 })
        })
    }

    useEffect(animateLetters, [messageRef])

    return (
        <div className="LoginHero">
            <h2 className="title">Nimbus Validator</h2>
            <p className="message" ref={messageRef}>
                {currentMessage}
            </p>
        </div >
    );
}