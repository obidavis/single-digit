import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faUndo, faRedo, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

type NoteToggleProps = {
  selected: boolean;
  onClick: () => void;
};

function NoteToggle(props: NoteToggleProps) {
  return (
    <div className="note-toggle">
      <button
        className={'note-toggle-button' +
          (props.selected ? ' selected' : '')}
        onClick={props.onClick}
      >
      <FontAwesomeIcon icon={faPencilAlt} />
      </button>
    </div>
  )
}

type GenericButtonProps = {
  onClick: () => void;
  valid: boolean;
};

function UndoButton(props: GenericButtonProps) {
  return (
    <div className="undo">
      <button
        className={"undo-button" + 
        (!props.valid ? ' invalid' : '')}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={faUndo} />
      </button>
    </div>
  )
}

function RedoButton(props: GenericButtonProps) {
  return (
    <div className="redo">
      <button
        className={"redo-button" + 
          (!props.valid ? ' invalid' : '')}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={faRedo} />
      </button>
    </div>
  )
}

function EraseButton(props: GenericButtonProps) {
  return (
    <div className="erase">
      <button
        className={"erase-button" + 
          (!props.valid ? ' invalid': '')}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={faEraser} />
      </button>
    </div>
  )
}

type ButtonsProps = {
  isNoteMode: boolean;
  canErase: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onNoteToggle: () => void;
  onErase: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

function Buttons(props: ButtonsProps) {
  return (
    <div className="buttons">
      <NoteToggle selected={props.isNoteMode} onClick={props.onNoteToggle}/>
      <EraseButton onClick={props.onErase} valid={props.canErase} />
      <UndoButton onClick={props.onUndo} valid={props.canUndo} />
      <RedoButton onClick={props.onRedo} valid={props.canRedo} />
    </div>
  )
}

export {Buttons};
export type {ButtonsProps};


type NumberSelectorButtonProps = {
  value: number;
  isSelected: boolean;
  onClick: () => void;
}

function NumberSelectorButton(props: NumberSelectorButtonProps) {
  return (
      <button
        className={'number-selector-button' + (props.isSelected ? ' selected' : '')}
        onClick={props.onClick}>
        {props.value}
      </button>
  );
}

type NumberSelectorProps = {
  currentSelection: boolean[];
  onSelectNumber: (value: number) => void;
}

function NumberSelector(props: NumberSelectorProps) {
  return (
    <div className='number-selector'>
      {Array.from(Array(9).keys()).map((i) => {
        return (
          <NumberSelectorButton
            key={i}
            value={i + 1}
            isSelected={props.currentSelection[i]}
            onClick={() => props.onSelectNumber(i + 1)} />
        );
      })}
    </div>
  );
}
export { NumberSelector };
export type { NumberSelectorProps };

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