import React, { useState, useEffect, useRef } from 'react';
import './LoginHero.scss';

const d = 300;

function randomDist(dist) {
    return (Math.random() * 2 - 1) * dist
}

// general purpose function used to delay for a set amount of time
const sleep = (ms) => new Promise(resolve => {
    setTimeout(() => {
        resolve()
    }, ms)
})

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
        const animationDuration = 1000
        const displayTime = 5000
        let isOnScreen = true;
        // NOTE: isOnScreen currently will NOT be set to false when the user changes the screen, which is the opposite of what we want
        const cleanup = () => {
            // TODO: Make a cleanup function that stops the memory leak error.
            letters.forEach(letter => letter.getAnimations().forEach(anim => anim.cancel()));
            isOnScreen = false
        }

        const letterAnimationState = letters.map(async (letter, i) => {
            let delay = i * 100;

            // animate each individual span element (character)
            let keyframes = {
                transform: [
                    `translate(${randomDist(d)}px, ${randomDist(d)}px)`,
                    'translate(0, 0)'],
                opacity: ['0.2', '1']
            };
            // easing: easInOutBack from https://easings.net/#easeInOutBack
            let anim = letter.animate(keyframes, { duration: animationDuration, easing: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)', delay: delay, fill: "forwards" });
            await sleep(animationDuration + displayTime)
            if(!isOnScreen) return cleanup
            anim.reverse()
            await sleep(animationDuration)
        });

        Promise.all(letterAnimationState).then(() => setIndex(i => (i + 1) % messages.length))

        return cleanup;
    }

    useEffect(animateLetters, [messageRef, index]);

    return (
        <div className="LoginHero">
            <h2 className="title">Nimbus Validator</h2>
            <p className="message" ref={messageRef}>
                {currentMessage}
            </p>
        </div >
    );
}