export interface RowItemProps {
    icon: string
    color: string
    title: string
    subtitle: string
    spinning: boolean
    onClick: () => void
}

export function RowItem (props: RowItemProps) {
    return <div className='rowItem' onClick={props.onClick}>
        <div className='rowItemIcon' style={{background: props.color}}>
            <img src={props.icon} className='rowItemIconItem'/>
        </div>
        <div className='rowItemTitle'>
            {props.title}
        </div>
        <div className='rowItemSubTitle'>
            {props.subtitle}
        </div>
        {
            props.spinning ?
            <div className="lds-dual-ring"></div> :
            null
        }
    </div>
}