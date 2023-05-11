import { BiBrain } from "react-icons/bi";
import { BiHomeAlt2 } from "react-icons/bi"
import { RiQuillPenLine } from "react-icons/ri"
import { AiOutlineInfoCircle } from "react-icons/ai"
import { IoAnalyticsOutline } from "react-icons/io5"
import { BsFillChatQuoteFill } from "react-icons/bs"
import { VscJson } from "react-icons/vsc"
import { SlMagnifier } from "react-icons/sl"
import { FiFolder } from "react-icons/fi"
import { FiTool } from "react-icons/fi"
import { BsLightbulb } from "react-icons/bs"
import { RiTestTubeFill } from "react-icons/ri"

export function IconByName ({name, size}: {name: string, size?: number}): {item: JSX.Element, color: string} {
    switch (name) {
        case "root":
            return {
                item: <BiHomeAlt2 color="white" size={size || 20}/>,
                color: "rgb(35, 3, 123)"
            }
        case "model":
            return {
                item: <BiBrain color="white" size={size || 20}/>,
                color: "rgb(78, 77, 77)"
            }
        case "context":
            return {
                item: <RiQuillPenLine color="white" size={size || 20}/>,
                color: "#880e8c",
            }
        case "modelQuery":
            return {
                item: <IoAnalyticsOutline color="white" size={size || 20}/>,
                color: "rgb(78, 77, 77)",
            }
        case "summary":
            return {
                item: <AiOutlineInfoCircle color="white" size={size || 20}/>,
                color: "#4b60cf",
            }
        case "chat":
            return {
                item: <BsFillChatQuoteFill color="white" size={size || 20}/>,
                color: "#880e8c",
            }
        case "format":
            return {
                item: <VscJson color="white" size={size || 20}/>,
                color: "rgb(78, 77, 77)",
            }
        case "view":
            return {
                item: <SlMagnifier color="white" size={size || 20}/>,
                color: "red",
            }
        case "files":
            return {
                item: <FiFolder color="white" size={size || 20}/>,
                color: "#008a22",
            }
        case "tool":
            return {
                item: <FiTool color="white" size={size || 20}/>,
                color: "rgb(180, 0, 0)",
            }
        case "goal":
            return {
                item: <BsLightbulb color="white" size={size || 18} style={{padding: 1}}/>,
                color: "rgb(199, 162, 17)",
            }
        case "testing":
            return {
                item: <RiTestTubeFill color="white" size={size || 18} style={{padding: 1}}/>,
                color: "rgb(194, 0, 136)",
            }
        default:
            return {
                item: <div/>,
                color: "red",
            }
    }
}