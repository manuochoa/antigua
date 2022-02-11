import React, { useEffect, useRef, useState } from 'react';
import Arrow from '../../Icons/Arrow';
import { checkForScrollbar } from "../../services/scrollbarService";

export default function Select({ className, list, callback, setList }) {
    const scrollwrapper = useRef(null);
    const [scrollVisible, setScrollVisible] = useState(false);
    const [opened, setOpened] = useState(false);
    let selectedTitle = list.find(item => item.selected === true).title;

    function selectItem(index) {
        setList(state => state.map((item, itemIndex) => ({ ...item, selected: itemIndex === index ? true : false })));
        callback && callback(index);
    }

    function toggleSelect() {
        setOpened(state => !state);
    }
    
    useEffect(() => {
        function handleDocumentClick() {
            if (opened) {
                toggleSelect();
            }
        };

        setScrollVisible(checkForScrollbar(scrollwrapper.current));

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        }
    }, [opened]);

    return (
        <div className={"select " + (className || "") + (opened ? " opened" : "") + (scrollVisible ? " scroll-visible" : "")}>
            <button className="select__button title" onClick={toggleSelect}>
                <span className="select__button-text">{selectedTitle}</span>
                <Arrow className="select__button-icon" />
            </button>
            <div className="select__list-wrapper">
                <ul className="select__list scrollwrapper select__scrollwrapper" ref={scrollwrapper}>
                    {list.map((item, index) => {
                        return (
                            <li className="select__item" key={item.id}>
                                <button
                                    className={"select__item-button" + (item.selected ? " selected" : "")}
                                    onClick={() => {
                                        selectItem(index);
                                    }}
                                >{item.title}</button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}
