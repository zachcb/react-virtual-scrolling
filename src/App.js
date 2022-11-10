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
  // InfiniteLoader. This is so we easily see the position rather
  // than created a new Array(X)
  const [list, setList] = useState({})
  const [currentIndex] = useState(99)

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
    return !!list[index.toString()];
  }

  const loadMoreRows = ({ startIndex, stopIndex }) =>  {
    return fetch(`${BASE_URL}/posts?_start=${startIndex}&_end=${stopIndex}`)
      .then(response => response.json())
      .then((data) => {
        let newData = {}


        // Apply data items to object.
        // The max result of startIndex and dataIndex + 1 should equal
        // stopIndex. Therefore fitting in with the loadMoreRows params
        data.forEach((item, dataIndex) => {
          newData[`${startIndex + dataIndex + 1}`] = item
        })

        setList({ ...list, ...newData })
      })
  }

  const rowRenderer = ({ key, index, style}) => {
    // If there isn't an item, show nothing
    if (!list[index.toString()]) {
      return;
    }

    return (
      <ListItem
        key={key}
        style={style}
      >
        {list[index.toString()].id}
      </ListItem>
    )
  }

  return (
    <Container className="App">
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
