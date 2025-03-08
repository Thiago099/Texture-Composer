<script>
  import { LoadingScreenManager } from "../modules/loadingScreenManager.svelte"

  const manager = LoadingScreenManager.GetSingleton()

  </script>
  {#if manager.GetDisplay()}
    <div class="loading-container">
      <div class="loading-panel">
        <h2>Task: {manager.GetTaskName()}</h2> 
        <h2>Action: {manager.GetItemName()}</h2>
        <div class="loading-bar-container">
          {#if manager.GetTimeless()}
            <div class="timeless-loading-bar"></div>
          {:else}
            <div class="loading-bar" style="width: {manager.GetItemPercentage()}"></div>
            <div class="percentage-overlay">{manager.GetItemPercentage()}</div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <style>
    .loading-container{
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
    .loading-panel{
        pointer-events: all;
        background-color: var(--secondary-color);
        border: 5px solid var(--background-color);
        position: relative;
        overflow: auto;
        overflow: hidden;
        box-shadow: 10px 8px 16px rgba(0, 0, 0, 0.2);
        width: 800px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center; 
        flex-direction: column;
    }
    .loading-bar-container {
      width: calc(100% - 60px);
      height: 30px;
      margin: 5px;
      background-color: var(--background-color);
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      position: relative;
    }
    .loading-bar{
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, #3498db, #2980b9);
      background-size: 300% 100%;
      animation: progress 2s ease-in-out infinite, gradient 4s ease infinite;
      border-radius: 15px;
    }


    .timeless-loading-bar {
      height: 100%;
      width: 30%;
      background: linear-gradient(90deg, #3498db, #2980b9, #3498db);
      background-size: 300% 100%;
      border-radius: 15px;
      animation: loading 2s infinite ease-in-out;
      position: absolute;
      width: 100%;
    }


    .percentage-overlay{
      position: absolute;
      top: 50%;
      left: 50%;
      font-weight: bold;
      transform: translate(-50%, -50%);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  </style>