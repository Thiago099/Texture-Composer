<script>
  let { value=$bindable(), children, oninput=()=>{} }= $props()
</script>
  
  <style>
    .toggle-container{
      width: 100%;
    }
  </style>
  
  <div class="toggle-container">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="button full" onclick={()=>{value = !value;oninput()}}><i class="fa-regular {value?"fa-circle-dot":"fa-circle"}"></i> {@render children()}</button>
  </div>
  
  