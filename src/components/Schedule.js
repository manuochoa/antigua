import { useEffect, useRef, useState } from "react";
import { checkForScrollbar } from "../services/scrollbarService";
import { getScrollbarWidth } from './../services/scrollbarService';

export default function Schedule({ schedule }) {
    const scrollwrapper = useRef(null);
    const [scrollVisible, setScrollVisible] = useState(false);

    useEffect(() => {
        setScrollVisible(checkForScrollbar(scrollwrapper.current));
    }, []);

    return (
        <div className={"schedule main__column main__column--1 main__background main__column--schedule" + ((scrollVisible && getScrollbarWidth() > 0) ? " scroll-visible" : "")}>
            <h1 className="title">Vesting Schedule</h1>
            <div className="table schedule__table">
                <div className="table__header">
                    <div className="table__row">
                        {Object.entries(schedule[0]).map(([key], index) => {
                            return key !== "id" && (
                                <div className={"table__text table__column table__column--" + (index + 1)} key={index}>{key}</div>
                            );
                        })}
                    </div>
                </div>
                <div className="scrollwrapper table__scrollwrapper" ref={scrollwrapper}>
                    <div className="table__body">
                        {schedule.map(item => {
                            return (
                                <div className="table__row" key={item.id}>
                                    {Object.entries(item).map(([key, value], index) => {
                                        return key !== "id" && (
                                            <div className={"table__column table__column--" + (index + 1)} key={index}>
                                                <span className="table__text">{value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}