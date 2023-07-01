import React from 'react'
import styles from './MainPage.module.scss'
import MainPageDesktop from './MainPage-Desktop'

export default function MainPage() {
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint = 576;

    React.useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth)
        window.addEventListener("resize", handleWindowResize);
    
        // Return a function from the effect that removes the event listener
        return () => window.removeEventListener("resize", handleWindowResize);
      }, []);

      return width < breakpoint ? <> Mobile</> : <MainPageDesktop />;
}
