export const inspectorCSS = `:host {
  position: absolute;
  top: 2em;
  left: 2em;
  right: 2em;
  bottom: 2em;
  box-sizing: border-box;
  font-family: sans-serif;
  box-shadow: 0 0 1em 2em rgba(0, 0, 0, 0.2);
  overflow: hidden;
  resize: both;

  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.5em);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000000;
}

.wrapper {
  width: 100%;
  height: 100%;
  padding: 1em;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto auto 1fr;
}

.header {
  text-align: center;
}

textarea {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
}

.success textarea {
  background: rgba(0, 255, 0, 0.5);
}

.failure textarea {
  background: rgba(255, 0, 0, 0.25);
}

.controls {
  text-align: center;
  align-items: center;
  margin: 0.5em;
  gap: 0.5em;
}

button {
  margin-right: 0.5em;
}
`;
