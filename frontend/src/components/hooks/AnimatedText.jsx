import { useEffect, useState } from 'react';

const useAnimatedText = (text, delay = 50) => {
  const [animatedText, setAnimatedText] = useState('');

  useEffect(() => {
    let currentText = '';
    text.split('').forEach((char, index) => {
      setTimeout(() => {
        currentText += char;
        setAnimatedText(currentText);
      }, index * delay);
    });
  }, [text, delay]);

  return animatedText;
};

export default useAnimatedText;
