<script>
  let { action, children }= $props()
</script>
  
  <style>
    .button-container{
      width: 100%;
    }
    </style>
  
  <div class="button-container">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="button full" onclick={action}>{@render children()}</button>
  </div>
  