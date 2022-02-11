import { useEffect, useRef, useState } from "react";
import { checkForScrollbar, getScrollbarWidth } from "../services/scrollbarService";

export default function Description({ description }) {
    const scrollwrapper = useRef(null);
    const [scrollVisible, setScrollVisible] = useState(false);

    useEffect(() => {
        setScrollVisible(checkForScrollbar(scrollwrapper.current));
    }, []);

    return (
        <div className={"description main__column main__column--1 main__background main__column--description" + ((scrollVisible && getScrollbarWidth() > 0) ? " scroll-visible" : "")}>
            <h1 className="title">Project Description</h1>
            <div className="scrollwrapper description__scrollwrapper" ref={scrollwrapper}>
                <p className="scrollwrapper__content description__text">{description}</p>
            </div>
        </div>
    );
}
