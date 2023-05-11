import { useRecoilState } from "recoil";
import { IconByName } from "../icon";
import { selectedObjects } from "../../state/selectedObjects";

export function ContextItemIcon ({type, id, parentId, loading}: {type: string, id: string, parentId: string, loading?: boolean}) {

    const [selected, setSelected] = useRecoilState(selectedObjects)

    const {item, color} = IconByName({name: type})

    return (
        <div 
            className={"icon-bubble"}
            style={{
                cursor: "pointer",
                backgroundColor: color
            }}
            onClick={() => {
                if (id === '') return
                if (selected.includes(id)) {
                    // If it exists, remove everything it and after it
                    setSelected(selected.slice(0, selected.indexOf(id)));
                } else {
                    // If it doesnt exist, remove everything after parentId and add it
                    setSelected(selected.slice(0, selected.indexOf(parentId) + 1).concat(id));
                }
            }}
        >
            {item}
            { loading && <div className="loading-icon" /> }
        </div>
    )

}