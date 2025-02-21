<script>
  import { rgbToHex } from "../../lib/color";
import { ColorPicker } from "../../modules/colorPicker.svelte";
    let {value = $bindable() }= $props()
    const picker = ColorPicker.GetSingleton();
  </script>


<div class="button-container">
    <button onclick={()=>picker.PickColor(value,c=> value = c)} class="button full color-icon-container"><div class="color-icon" style="background-color: rgba({value[0]},{value[1]},{value[2]},{value[3]/255});"></div>#{rgbToHex(...value)} {(value[3]/255*100).toFixed(2)}</button>
</div>

<style>
  .color-icon-container{
    display: flex;
    align-items: center;
  }
  .color-icon{
      width: 15px;
      height: 15px;
      display: block;
      margin-right: 10px;
  }
</style>