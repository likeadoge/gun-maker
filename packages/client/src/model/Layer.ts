import { Mut, Ref } from "@/reactive/base"
import { CacheList } from "@/reactive/cache"
import { Part, PartLayerPreview, partLayers, PartLayerScreen } from "./Part"
import { LayerPreview } from "./Preview"
import { LayerScreen } from "./Screen"
import { sightLayerScreen } from "./Sight"

export const layerScreenList = new CacheList<Mut<Part>, Ref<LayerScreen>>(partLayers, (layer) => layer
    .compute(layer => new PartLayerScreen(layer))
).compute(v=>{
    const val = v.val()
    return [...val,sightLayerScreen]
})


export const layerPreviewList = new CacheList<Mut<Part>, Ref<LayerPreview>>(partLayers, (layer) => layer
.compute(layer => new PartLayerPreview(layer))
)


