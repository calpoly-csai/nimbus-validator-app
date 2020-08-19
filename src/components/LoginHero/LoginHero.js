import React, { useEffect, useRef } from 'react';
import './LoginHero.scss';

const d = 300

function randomDist(dist) {
    return (Math.random() * 2 - 1) * dist
}

export default function LoginHero() {
    let messages = ["Hello Nimbus",
                    "Nimbus, consider yourself validated",
                    "Nimbus, what is CSAI?",
                    "Nimbus, take me to your data",
                    "Let's clean some data",
                    "CS + AI = best club ever"];
    let index = Math.floor(Math.random() * messages.length)
    let messageRef = useRef(null)
    let currentMessage = messages[index].split('').map((char, i) => <span className='letter' style={{
        display: `${char === ' ' ? 'initial' : ''}`
    }} key={i} > {char}</ span >)

    let animateLetters = () => {
        let letters = [...messageRef.current.children]
        letters.forEach(letter => {
            // animate each individual span element (character)
            let keyframes = {
                transform: [`translate(${1 * randomDist(d)}px, ${1 * randomDist(d)}px)`, 
                `translate(${0.8911 * randomDist(d)}px, ${0.8911 * randomDist(d)}px)`,
                `translate(${0.5644 * randomDist(d)}px, ${0.5644 * randomDist(d)}px)`,
                `translate(${0.0299 * randomDist(d)}px, ${0.0199 * randomDist(d)}px)`,
                `translate(${0.0066 * randomDist(d)}px, ${0.0066 * randomDist(d)}px)`,
                `translate(${0.0163 * randomDist(d)}px, ${0.0163 * randomDist(d)}px)`,
                `translate(${0.0154 * randomDist(d)}px, ${0.0154 * randomDist(d)}px)`,
                `translate(0, 0)`],
                opacity: ['0.2', '1']
            }
            // easing function: easeInOutSine https://easings.net/#easeInOutSine
            letter.animate(keyframes, { duration: 4000, easing: 'cubic-bezier(0.37, 0, 0.63, 1)' })
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