<script>
  import {  rgbToHex } from "../../lib/color";

    
    let { value=$bindable(), options, placeholder='None',renderFunction=null,oninput=()=>{}  }= $props()

import Select from "../inputs/Select.svelte";

</script>

{#snippet colorOption(option)}
<div class="option-container">
    <div class="color-option" style="background-color: #{rgbToHex(...option)};"></div>#{rgbToHex(...option)}
</div>
{/snippet}

<Select placeholder={placeholder} bind:value={value} options={options} renderFunction={colorOption} oninput={oninput}></Select>

<style>

    .color-option,.color-option-none{
        width: 15px;
        height: 15px;
        display: block;
        margin-right: 10px;
    }
    .color-option-none{
        color: red;
    }
    .option-container{
        display: flex;
        align-items: center;
    }

</style>