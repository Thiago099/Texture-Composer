
<script>
  import { onMount } from "svelte";

    let { 
      value=$bindable(), 
      options,
      placeholder='None',
      renderFunction=null,
      oninput=()=>{}, 
      filter = () => true  ,
      disabled = false,
      hasNone = true
    }= $props()

    let isOpen = $state(false);
    let element, opt = $state()
    
  
    function selectOption(option) {
      isOpen = false;
      value = option
      oninput?.()
    }

    function getEl(){
      let el = element

      while(el && window.getComputedStyle(el).overflow != "auto"){
        el = el.parentElement
      }
      return el
    }

    onMount(()=>{

      document.addEventListener("click",e=>{
        if (!element?.contains(e.target)) {
          isOpen = false
        } 
      })

      const el = getEl()
      el?.addEventListener("scroll",()=>{
        if(opt){
          const offset = el.scrollTop ;
          opt.style.transform = `translateY(-${offset}px)`;
      }
      })
    })

    $effect(() => {
      if (opt) {
        const el = getEl();
        const offset = el.scrollTop;

        opt.style.transform = `translateY(-${offset}px)`;

        const rect = opt.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.bottom > viewportHeight) {
          const overflow = rect.bottom - viewportHeight;
          opt.style.transform = `translateY(-${offset + overflow}px)`;
        }
      }
    });
  

    function toggleVisibility(separator) {
      return e=>{
        separator.openCtx = !separator.openCtx
      }
    }

    function isVisible(index){
      for(let i = index-1; i >= 0; i--){
          if(options[i].type == "separator"){
            return options[i].openCtx;
          }
      }
      return true
    }
  
  </script>
  
  <style>
    .dropdown {
      position: relative;
      display: inline-block;
      width: 100%;
    }
  
    .selected {
      padding: 5px;
      border-radius: 4px;
      background-color: var(--background-color);
      color: var(--text-color);
    }
    .selected:not(.disabled){
      cursor: pointer;
    }
    .selected:not(.disabled):hover {
      background-color: var(--overlay-color); 
    }
    .selected.disabled{
      opacity: 0.5;
    }

  
    .options {
      position: fixed;
      background-color: var(--background-color);
      color: var(--text-color);
      border-radius: 4px;
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      display: none;
      margin-top: 5px;
    }
  
    .options.open {
      display: block;
    }
  
    .option {
      padding: 8px;
      padding-left: 20px;
      cursor: pointer;
      min-width: 300px;
    }

    .separator {
      padding-left: 10px;
      padding-top: 5px;
      margin-top: 5px;
      padding-bottom: 5px;
      box-shadow:inset  0px 0px 16px rgba(0, 0, 0, 0.3); 
      display: flex;
      cursor: pointer;
      justify-content: space-between;
    }
    .separator:hover{
      background-color: var(--overlay-color);
    }
  
    .option:hover {
      background-color: var(--overlay-color);
    }
    .separator-icon{
      margin: 0 10px;
    }
  </style>
  
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="dropdown "
    bind:this={element}
  >
    <!-- Selected Item -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="selected row v-center {disabled?"disabled":""}" onclick={() => (isOpen = disabled?false:!isOpen)}>
      <i class="fa-solid fa-angle-down" style="margin-right: 10px;"></i>
      {#if value}
        {#if renderFunction}
            {@render renderFunction(value)}
        {:else}
            {value.name}
        {/if}    
      {:else}
        {placeholder}
      {/if}
    </div>
  
    <!-- Options List -->
    {#if isOpen}
      <div class="options open" bind:this={opt}>
        
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        {#if hasNone}
          <div
          class="option"
          onclick={() => selectOption(null)}
          >
          {placeholder}
          </div>
        {/if}


          {#each options as option, index(option)}
              {#if option.type == "separator"}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="separator" onclick={toggleVisibility(option)}>
                  {option.name}
                  <i class="separator-icon fa-solid {option.openCtx?"fa-angle-left":"fa-angle-down"}"></i>
                </div>
              {:else}
              {#if filter(option) && isVisible(index)}


              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="option"
                    onclick={() => selectOption(option)}
                  >
                  {#if renderFunction}
                      {@render renderFunction(option)}
                    {:else}
                      {option.name}
                      {/if}  
                  </div>
                {/if}
              {/if}

    
          {/each}
      </div>
    {/if}
  </div>
  