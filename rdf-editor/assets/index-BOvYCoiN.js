class i{constructor(o,r){this.Impl=o,this.options=r}import(o,r){const t=new this.Impl(o,{...this.options,...r});return o.on("end",()=>{t.readable||t.emit("end")}),o.on("error",e=>{t.emit("error",e)}),t}}export{i as S};
