import './App.css';
import styled from 'styled-components';
import { useState } from 'react'
import { InfiniteLoader, List } from 'react-virtualized';
import 'react-virtualized/styles.css';

const BASE_URL = "http://localhost:3000"

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
`

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid black;
  border-radius: 4px;
  height: 180px;
  width: 300px;
  font-size: 1.25rem;
  font-weight: 700;
`

const ListItem = styled.div`
  &:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.25);
  }
`

function App() {
  // Object of items, keyed by the index to be rendered in the
  // InfiniteLoader. This is so we easily set/get the index
  // rather than creating a new Array(X)
  const [list, setList] = useState({})

  // Currently using a static last item index
  const [currentIndex, setCurrentIndex] = useState(50)

  // Number of rows in list; can be arbitrary high number if actual number is unknown.
  const remoteRowCount = 100

  // Threshold at which to pre-fetch data. A threshold X means that data will start loading when a user scrolls within X rows. Defaults to 15
  const threshold = 15

  // Minimum number of rows to be loaded at a time. This property can be used to batch requests to reduce HTTP requests. Defaults to 10.
  const minimumBatchSize = 10

  // Number of rows to render above/below the visible bounds of the list. This can help reduce flickering during scrolling on certain browsers/devices.
  const overscanRowCount = 5

  // If it is not in the list, load more
  const isRowLoaded = ({ index }) => {
    return !!list[index];
  }

  const handleInput = (event) => {
    setCurrentIndex(parseInt(event.target.value, 10))
  }

  const loadMoreRows = ({ startIndex, stopIndex }) =>  {
    return fetch(`${BASE_URL}/posts?_start=${startIndex}&_end=${stopIndex + 1}`)
      .then(response => response.json())
      .then((data) => {
        let newData = {}
        
        data.forEach((item, dataIndex) => {
          const index = startIndex + dataIndex
          newData[index] = item
        })

        setList(Object.assign({ ...list, ...newData }))
      })
  }

  const rowRenderer = ({ key, index, style}) => {
    // If there isn't an item, show nothing
    if (!list[index]) {
      return <div key={key}>loading..</div>;
    }

    return (
      <ListItem
        key={key}
        style={style}
      >
        {list[index].id}
      </ListItem>
    )
  }

  return (
    <Container className="App">
      <input onInput={handleInput} placeholder={currentIndex}></input>
      <Content>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={remoteRowCount}
          minimumBatchSize={minimumBatchSize}
          threshold={threshold}
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              height={180}
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={remoteRowCount}
              overscanRowCount={overscanRowCount}
              rowHeight={20}
              rowRenderer={rowRenderer}
              scrollToIndex={currentIndex}
              width={300}
            />
          )}
        </InfiniteLoader>
      </Content>
    </Container>
  );
}

export default App;
