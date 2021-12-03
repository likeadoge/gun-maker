import './icon.js'

import { complete, style } from "./utils";

import { initView } from '@/view'


style({
  'html,body': {
    'margin': '0',
    'padding': '0',
    'height': '100%'
  }
})

await complete

initView()
