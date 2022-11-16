import { Buttons } from './Buttons'
import { NumberSelector } from './NumberSelector'

type ControlsProps = {
  isNoteMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canErase: boolean;
  currentSelection: boolean[];
  onSelectNumber: (value: number) => void;
  onNoteToggle: () => void;
  onErase: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

function Controls(props: ControlsProps) {
  return (
    <div className='controls'>
      <NumberSelector
        currentSelection={props.currentSelection}
        onSelectNumber={props.onSelectNumber} />
      <Buttons 
        isNoteMode={props.isNoteMode}
        canErase={props.canErase}
        canUndo={props.canUndo}
        canRedo={props.canRedo}
        onErase={props.onErase}
        onNoteToggle={props.onNoteToggle}
        onRedo={props.onRedo}
        onUndo={props.onUndo} />
    </div>
  )
}

export { Controls };
export type { ControlsProps };