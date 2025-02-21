<script>
  let {value = $bindable() }= $props()
</script>
  
  <style>
    

    </style>
  
  <div class="range-container">
    <input type="text" bind:value={value}>
  </div>
  