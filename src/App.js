import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const canvasRef = useRef(null);
    const [captchaText, setCaptchaText] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [captchaStatus, setCaptchaStatus] = useState('');

    // Array of font styles for CAPTCHA text
    const fonts = ['30px Arial', '32px Courier New', '34px Georgia', '36px Times New Roman', '38px Verdana'];

    // Function to generate a random character from the possible characters
    const getRandomChar = () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        .charAt(Math.floor(Math.random() * 62));

    // Function to generate a CAPTCHA text
    const generateCaptcha = () => {
        const text = Array.from({ length: 6 }, getRandomChar).join('');
        drawCaptcha(text);
        setCaptchaText(text);
    };

    // Function to draw the CAPTCHA text with distortions on the canvas
    const drawCaptcha = (text) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textBaseline = 'middle';

        text.split('').forEach((char, i) => {
            const x = 50 * i + 15;
            const y = canvas.height / 2;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.scale(1 + (Math.random() - 0.5) * 0.2, 1 + (Math.random() - 0.5) * 0.2);
            ctx.translate(-x, -y);

            ctx.font = fonts[Math.floor(Math.random() * fonts.length)];
            ctx.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            ctx.fillText(char, x, y);

            ctx.restore();
        });

        for (let i = 0; i < 100; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
            ctx.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            ctx.fill();
        }
    };

    useEffect(() => {
        generateCaptcha(); // Generate CAPTCHA on initial render
    }, []);

    const handleRefreshCaptcha = () => {
        generateCaptcha();
    };

    const handleSubmitCaptcha = () => {
        if (inputValue === captchaText) {
            setCaptchaStatus('CAPTCHA correct!');
        } else {
            setCaptchaStatus('CAPTCHA incorrect. Please try again.');
        }
    };

    return (
        <div className="App">
            <div className="captcha-container">
                <canvas ref={canvasRef} width="300" height="100"></canvas>
                <button onClick={handleRefreshCaptcha}>Refresh CAPTCHA</button>
            </div>
            <div className="input-container">
                <input
                    id="captchaInput"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter CAPTCHA"
                />
                <button onClick={handleSubmitCaptcha}>Submit</button>
            </div>
            <p className={`captcha-status ${captchaStatus.includes('correct') ? 'correct' : 'incorrect'}`}>
                {captchaStatus}
            </p>
        </div>
    );
};

export default App;
