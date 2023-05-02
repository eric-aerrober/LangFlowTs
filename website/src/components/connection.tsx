import network from "../state/network/network.class";

interface CurvedLineProps {
  id: string;
  visible: boolean;
  start: {x: number, y: number};
  end: {x: number, y: number};
}

export function CurvedLine (props: CurvedLineProps) {
    const { start, end } = props;

    const upperLeft = {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
      };
    
      const bottomRight = {
        x: Math.max(start.x, end.x),
        y: Math.max(start.y, end.y),
      };
    
      const nubX = Math.max(0, end.x - start.x);
      const nubY = Math.max(0, end.y - start.y);
    
      return (
        <>
        <div 
            style={{
              position: 'absolute',
              left: upperLeft.x - 10 + nubX,
              top: upperLeft.y - 10 + nubY,
              
            }}
            className="nodeSourceHook"
            onClick={(e) => {
              network.toggleVisability(props.id)
              e.preventDefault();
              e.stopPropagation();
            }}
          />
          
        <div
          style={{
            position: 'absolute',
            left: upperLeft.x - 10,
            top: upperLeft.y - 10,
            width: bottomRight.x - upperLeft.x + 20,
            height: bottomRight.y - upperLeft.y + 20,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          
          {
            props.visible && <svg width={bottomRight.x - upperLeft.x + 20} height={bottomRight.y - upperLeft.y + 20} style={{position: 'absolute'}}>
              <path
                d={`M ${start.x - upperLeft.x + 10} ${start.y - upperLeft.y + 10} L ${end.x - upperLeft.x + 10} ${end.y - upperLeft.y + 10}`}
                stroke="black"
                fill="transparent"
              />
            </svg>
          }
        </div>
        </>
      );
}