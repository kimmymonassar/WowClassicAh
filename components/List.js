import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import getInitialData from '../api/initialData';
import SQLite from 'react-native-sqlite-storage';

const styles = StyleSheet.create({
  dbItemWrapper: {
    marginBottom: '5%',
  },
  firstTextWrapper: {
    color: 'white',
    backgroundColor: 'black',
    fontSize: 16,
    paddingTop: 15,
  },
  textStyle: {
    color: 'white',
    backgroundColor: 'black',
    fontSize: 16,
  },
  lastTextWrapper: {
    color: 'white',
    backgroundColor: 'black',
    fontSize: 16,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
});

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      start: 0,
      num: 10,
    };
  }

  getItemFromName(name) {
    const query = `SELECT entry, name FROM item_template WHERE name = '${name}'`;

    let db = SQLite.openDatabase({
      name: 'full_db_classic_sqlite.db',
      createFromLocation: '~full_db_classic_sqlite.db',
      readOnly: true,
    });

    db.transaction(tx => {
      tx.executeSql(
        query,
        [],
        (tx, results) => {
          console.log(results);
        },
        error => {
          console.log(error.message);
        },
      );
    });
  }

  getItemName(itemObject) {
    const query = `SELECT * FROM item_template WHERE entry = '${itemObject.itemString}'`;

    let db = SQLite.openDatabase({
      name: 'full_db_classic_sqlite.db',
      createFromLocation: '~full_db_classic_sqlite.db',
      readOnly: true,
    });

    db.transaction(tx => {
      tx.executeSql(
        query,
        [],
        (tx, results) => {
          for (let i = 0; i < results.rows.length; i++) {
            let object = {
              name: results.rows.item(i).name,
            };
            Object.assign(itemObject, object);
            this.setState({
              items: this.state.items.concat(itemObject),
            });
            console.log(this.state);
          }
        },
        error => {
          console.log(error.message);
        },
      );
    });
  }

  getAllItems() {
    getInitialData().then(items => {
      for (let i = this.state.start; i < this.state.num; i++) {
        this.getItemName(items[i]);
      }
    });
  }

  componentDidMount() {
    this.getAllItems();
  }

  render() {
    return (
      <>
        <View>
          {this.state.items.map(item => {
            return (
              <View style={styles.dbItem} key={item.itemString}>
                <Text style={styles.firstTextWrapper}>Name: {item.name}</Text>
                <Text style={styles.textStyle}>
                  minBuyout: {item.minBuyout}
                </Text>
                <Text style={styles.textStyle}>
                  marketValue: {item.marketValue}
                </Text>
                <Text style={styles.lastTextWrapper}>
                  historical: {item.historical}
                </Text>
              </View>
            );
          })}
        </View>
      </>
    );
  }
}

export default List;
