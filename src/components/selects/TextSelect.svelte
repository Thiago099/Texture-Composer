<script>
    let { value=$bindable(), options, placeholder='None',renderFunction=null, disabled=false,oninput=()=>{}  }= $props()

import Select from "../inputs/Select.svelte";

</script>

{#snippet option(option)}
<div class="option-container">
    {option.name}
</div>
{/snippet}

<Select disabled={disabled} placeholder={placeholder} bind:value={value} options={options} renderFunction={option} oninput={oninput}></Select>

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