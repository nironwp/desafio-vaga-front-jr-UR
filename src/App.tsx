import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
// import useWindowDimensions from './utils/useWindowDimensions';

interface IMarker {
  x: number;
  y: number;
}

function getElementPos(element:HTMLElement){
  const cords = element.getBoundingClientRect()
  return {x:cords?.left, y:cords?.top}
}
function App() {
  // const { height, width } = useWindowDimensions();
  const [markers, setMarkers] = useState<IMarker[]>([])
  const inStorage = useRef<IMarker>()
  const posicao = useCallback((e: MouseEvent) => {
    const redoButton = document.getElementById('redo')
    const undoButton = document.getElementById('undo')
    const x =e.clientX
    const y =e.clientY
    
    if(redoButton){
      const getRedoPos = getElementPos(redoButton);
        if(x > getRedoPos.x && x < (getRedoPos.x + redoButton.clientWidth))
          return;
        if(y > getRedoPos.y && y < (getRedoPos.y + redoButton.clientHeight))
          return;
    }
    if(undoButton){
      const getUndoPos = getElementPos(undoButton);
        if(x > getUndoPos.x && x < (getUndoPos.x + undoButton.clientWidth))
          return;
        if(y > getUndoPos.y && y < (getUndoPos.y + undoButton.clientHeight))
          return;
    }
      setMarkers(prevState => [...prevState, {x,y}]);
  },[])

  document.addEventListener('click',posicao)
  const redo = useCallback(() => {
    setMarkers(prevState => {
    if(inStorage.current){
      prevState.push(inStorage.current)
      inStorage.current = undefined;
    }
     return [...prevState]
    });
  },[])
  const undo  = useCallback(() =>{
    setMarkers(prevState => {
     inStorage.current= prevState.pop()
     return [...prevState]
    });
  },[])
 useEffect(() => {console.log(markers)},[markers])
  return (
    <div className="App">
      <button className='fixed right action_btn green z-100' id='undo' onClick={undo}>undo</button>
      <button className='fixed left action_btn cyan z-100' id='redo' onClick={redo}>redo</button>
      {
        markers.map(marker => {
          return (
            <div className='marker absolute' style={{ left: (marker.x - 22)+'px', top: (marker.y - 20)+'px' }}></div>
          )
        })
      }
    </div>
  );
}

export default App;
