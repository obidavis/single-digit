

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
        Note
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
        Undo
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
        Redo
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
        Erase
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