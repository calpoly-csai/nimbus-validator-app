import React, { useState, useEffect, useRef } from 'react';
import './LoginHero.scss';

const d = 300;

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
    let [index, setIndex] = useState(Math.floor(Math.random() * messages.length));
    let messageRef = useRef(null);
    let currentMessage = messages[index].split('').map((char, i) => <span className='letter' style={{
        display: `${char === ' ' ? 'initial' : ''}`
    }} key={i} > {char}</ span >);

    let animateLetters = () => {
        let letters = [...messageRef.current.children];
        let i = 0;
        letters.forEach(letter => {
            let delay = i * 100;
            // animate each individual span element (character)
            let keyframes = {
                transform: [
                `translate(${randomDist(d)}px, ${randomDist(d)}px)`,
                'translate(0, 0)'],
                opacity: ['0.2', '1']
            };
            // easing: easInOutBack from https://easings.net/#easeInOutBack
            letter.animate(keyframes, { duration: 1000, easing: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)', delay: delay});
            setTimeout(() => {letter.style.opacity = 1}, delay + 100);
            i++;
        });
    }

    useEffect(animateLetters, [messageRef]);

    return (
        <div className="LoginHero">
            <h2 className="title">Nimbus Validator</h2>
            <p className="message" ref={messageRef}>
                {currentMessage}
            </p>
        </div >
    );
}