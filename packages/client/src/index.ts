import './icon.js'

import { complete } from "./utils";

import { initView } from '@/view'
import { style } from './utils/style';


style({
  'html,body': {
    'margin': '0',
    'padding': '0',
    'height': '100%'
  }
})

await complete

initView()
