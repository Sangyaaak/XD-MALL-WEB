import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ArrowRight } from "../../images/Icons"

const AUTO_PALY_DELAY = 3000

export default function MyCarousel({ children }) {
    let carouselItems = checkAndReturnCarouselItems(children)
    const [curIndex, setCurIndex] = useState(0)
    const [curItemPosition, setCurItemPosition] = useState({
        transform: "translateX(0)"
    })
    const items = useRef({})
    const intervalId = useRef(null)

    useEffect(() => {
        autoSwitchWithDelay(AUTO_PALY_DELAY)
        return () => clearInterval(intervalId.current)
    }, [carouselItems])

    function autoSwitchWithDelay(duration) {
        if (intervalId.current) {
            clearInterval(intervalId.current)
        }

        intervalId.current = setInterval(() => {
            toNext()
        }, duration)
    }

    function switchToPrev() {
        autoSwitchWithDelay(AUTO_PALY_DELAY)
        setCurIndex((curIndex) => {
            let index = curIndex > 0 ? curIndex - 1 : carouselItems.length - 1
            translateItems(index)
            return index
        })
    }

    function switchToNext() {
        autoSwitchWithDelay(AUTO_PALY_DELAY)
        toNext()
    }

    function toNext() {
        setCurIndex((curIndex) => {
            let index = curIndex < carouselItems.length - 1 ? curIndex + 1 : 0
            translateItems(index)
            return index
        })
    }

    function switchToIndex(index) {
        autoSwitchWithDelay(AUTO_PALY_DELAY)
        setCurIndex(index)
        translateItems(index)
    }

    function translateItems(curIndex) {
        const translateX = items.current.clientWidth * curIndex
        setCurItemPosition({ transform: `translateX(-${translateX}px)` })
    }

    return (
        <div className="my-carousel-wraper">
            <div
                className="my-carousel__controler__prev"
                onClick={switchToPrev}
            >
                <ArrowLeft className="my-carousel__controler__arrow"></ArrowLeft>
            </div>
            <div
                ref={items}
                className="my-carousel__items-wraper"
                style={curItemPosition}
            >
                {carouselItems}
            </div>
            <div
                className="my-carousel__controler__next"
                onClick={switchToNext}
            >
                <ArrowRight className="my-carousel__controler__arrow"></ArrowRight>
            </div>

            <Indicators
                curIndex={curIndex}
                itemAmount={carouselItems.length}
                switchToIndex={switchToIndex}
            ></Indicators>
        </div>
    )
}

function checkAndReturnCarouselItems(children) {
    let carouselItems = []
    if (Array.isArray(children)) {
        carouselItems = children
    } else if (children) {
        carouselItems = [children]
    }
    return carouselItems
}

function Indicators({ curIndex, itemAmount, switchToIndex }) {
    const indicators = new Array(itemAmount)
        .fill(0)
        .map((value, index) => (
            <span
                key={index}
                className={
                    index === curIndex ? "indicator--current" : "indicator"
                }
                onClick={() => switchToIndex(index)}
            ></span>
        ))

    return <div className="indicators-wraper">{indicators}</div>
}
