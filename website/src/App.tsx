import './App.css';
import { RecoilRoot } from 'recoil';
import { SidebarLeft } from './layouts/SidebarLeft';
import { setNodeScale } from './state/manual/nodeNetwork';
import Network from './components/network';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import React, { useEffect } from 'react';
import {runStartup} from './singularity/start'
import { SidebarRight } from './layouts/SidebarRight';
import network from './state/network/network.class';
import { testWorkflow } from './workspace/test';
import Hud from './components/hud';

runStartup();

export default function App() {

  useEffect(() => {
      testWorkflow();
  }, []);

  return (
    <RecoilRoot>
      <div className ="transform-wrapper">
        <TransformWrapper minScale={0.5} maxScale={10} initialScale={1} onTransformed={(d, state) => network.setScale(state.scale)} >
          <TransformComponent>
            <Network/>
          </TransformComponent>
        </TransformWrapper>
      </div>
      <Hud/>
      <SidebarRight/>
    </RecoilRoot>
  );
}
