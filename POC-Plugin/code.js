figma.showUI(`
    <div style="font-family: sans-serif; padding: 12px; width: 280px;">
      <p>Prefix Letter:</p>
      <input id="prefix" placeholder="e.g. E" style="width: 100%; padding: 6px;"/>
  
      <p style="margin-top:8px;">Start Number:</p>
      <input id="start" type="number" placeholder="e.g. 10" style="width: 100%; padding: 6px;"/>
  
      <p style="margin-top:8px;">Name:</p>
      <input id="name" placeholder="e.g. T&C" style="width: 100%; padding: 6px;"/>
  
      <button id="run" style="margin-top: 12px; padding: 6px 12px;">Rename</button>
  
      <script>
        document.getElementById('run').onclick = () => {
          const prefix = (document.getElementById('prefix')).value
          const start = parseInt((document.getElementById('start')).value)
          const name = (document.getElementById('name')).value
          parent.postMessage({ pluginMessage: { type: 'run', prefix, start, name } }, '*')
        }
      </script>
    </div>
  `, { width: 300, height: 230 })

figma.ui.onmessage = (msg) => {
    if (msg.type === 'run') {
        const selection = figma.currentPage.selection

        if (selection.length === 0) {
            figma.notify("⚠️ Please select at least one frame")
            return
        }

        let counter = msg.start
        for (const node of selection) {
            if (node.type === "FRAME") {
                // Format number with leading zero (01, 02, 03…)
                const number = counter.toString().padStart(2, "0")

                // Build final name
                const newName = `${msg.prefix}.${number}-01.A | ${msg.name}`
                node.name = newName

                counter++
            }
        }

        figma.closePlugin("✅ Frames renamed successfully")
    }
}
