<script>
  let { value=$bindable(), min, max, step, reset=null, oninput=()=>{}}= $props()

</script>
  
  <style>
    .range-container {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  
    .number-display {
      font-size: 1.2rem;
      font-weight: bold;
      width: 40px;
      text-align: right;
    }
  
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 8px;
      border-radius: 5px;
      background: var(--background-color);
      outline: none;
      opacity: 0.9;
      transition: opacity 0.2s ease;
    }
  
    input[type="range"]:hover {
      opacity: 1;
    }
  
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: var(--text-color);
      cursor: pointer;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
      transition: background 0.2s ease;
    }
  
    input[type="range"]::-webkit-slider-thumb:hover {
      background: var(--text-color);
    }
  
    input[type="range"]::-moz-range-thumb {
      width: 5px;
      height: 20px;
      border-radius: 50%;
      background: var(--text-color);
      cursor: pointer;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    }

    input[type="number"]{
        border: none;
        color: var(--text-color);
        background-color: var(--background-color);
        padding: 3px 0px;
        text-align: center;
        width: 60px;
        text-align: center;
    }
    button{
      padding: 5px 10px;
    }
  </style>
  
  <div class="range-container">
    {#if reset != null}
    <button class="button" onclick={e=>{reset();oninput(e)}}>Reset</button>
    {/if}
    <input type="number" bind:value={value} onchange={e=>oninput(e)} >
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      bind:value={value}
      onchange={e=>oninput(e)}
    />
  </div>
  