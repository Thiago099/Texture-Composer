<script>
  let {value = $bindable() }= $props()

  $effect(()=>{
    if(typeof value == "string"){

      let data = value.replace(/[^0-9\-]/gi,"")
      if(data != value){
        value = data
      }
    }
  })

</script>
  
  <style>
    

    </style>
  
  <div class="range-container">
    <input type="text" bind:value={value}>
  </div>
  