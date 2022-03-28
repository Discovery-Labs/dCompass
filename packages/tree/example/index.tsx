import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import {
//   SkillTree,
//   SkillTreeGroup,
//   SkillProvider,
//   SkillGroupDataType,
//   SavedDataType,
// } from '../src';
import {
  SkillTree,
  SkillTreeGroup,
  SkillProvider,
  SkillGroupDataType,
  SavedDataType,
  NodeSelectEvent,
} from '../dist/index';
import './index.css';
import {
  legsPushData,
  legsPullData,
  hpSavedData,
  pushUpData,
  webDevData,
} from './mockData';
import { ContextStorage } from '../src/models';
import FilterInput from './components/FIlterInput';
import DisabledSkillTree from './components/DisabledSkillTree';

function handleSave(
  storage: ContextStorage,
  treeId: string,
  skills: SavedDataType
) {
  return storage.setItem(`skills-${treeId}`, JSON.stringify(skills));
}

function handleNodeSelect(e: NodeSelectEvent) {
  console.log('selected node - ', e.key);
  console.log('new state - ', e.state);
}

const App = () => {
  return (
    <SkillProvider>
      <SkillTreeGroup
        theme={{
          headingFont: 'impact',
          nodeAlternativeActiveBackgroundColor: 'blue',
          nodeAlternativeFontColor: '#F7B538',
          nodeAltenativeActiveFontColor: 'white',
        }}
      >
        {({
          skillCount,
          selectedSkillCount,
          resetSkills,
          handleFilter,
        }: SkillGroupDataType) => {
          const totalSkillCount = skillCount.optional + skillCount.required;
          const totalSelectedCount =
            selectedSkillCount.optional + selectedSkillCount.required;

          return (
            <React.Fragment>
              <nav
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '32px',
                }}
              >
                <ul>
                  <li>
                    <a href="#sp">Squat Progression</a>
                  </li>
                  <li>
                    <a href="#hp">Hinge Progression</a>
                  </li>
                </ul>
                <h2 className="Example__heading">
                  Completed skills: {totalSelectedCount}/{totalSkillCount}
                </h2>
                <button className="Example__reset-button" onClick={resetSkills}>
                  Reset
                </button>

                <FilterInput handleFilter={handleFilter} />
              </nav>
              <div>
                <SkillTree
                  closedByDefault
                  treeId="sp"
                  handleNodeSelect={handleNodeSelect}
                  title="Squat Progression"
                  description="These are the progressions for squats"
                  data={legsPushData}
                  collapsible
                />
                <SkillTree
                  closedByDefault
                  treeId="pu"
                  handleNodeSelect={handleNodeSelect}
                  title={
                    <>
                      <span>Pull Up Progression</span>
                      <span style={{ position: 'absolute', right: '8px' }}>
                        ⓘ
                      </span>
                    </>
                  }
                  description="These are the progressions for pullups"
                  data={pushUpData}
                  collapsible
                />
                <SkillTree
                  treeId="hp"
                  handleNodeSelect={handleNodeSelect}
                  title="Hinge Progression"
                  data={legsPullData}
                  savedData={hpSavedData}
                  handleSave={handleSave}
                />
                <SkillTree
                  treeId="web"
                  handleNodeSelect={handleNodeSelect}
                  title="Programming Tree"
                  data={webDevData}
                  handleSave={handleSave}
                />
                <DisabledSkillTree
                  handleNodeSelect={handleNodeSelect}
                  handleSave={handleSave}
                />
              </div>
            </React.Fragment>
          );
        }}
      </SkillTreeGroup>
    </SkillProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
