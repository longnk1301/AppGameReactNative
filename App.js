/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Animated, ImageBackground} from 'react-native';

import Enemy from './components/Enemy';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state={
            movePlayerVal: new Animated.Value(40),
            playserSide: 'left',
            points: 0,

            moveEnemyVal: new Animated.Value(0),
            enemyStartposX: 0,
            enemySide: 'left',
            enemySpeed: 3000,

            gameOver: false,
        };
    }

    movePlayer(direction) {
        if (direction == 'right') {
            this.setState({playserSide: 'right'});

            Animated.spring(
                this.state.movePlayerVal,
                {
                    toValue:Dimensions.get('window').width - 140,
                    tension: 120,
                }
            ).start();
        } else if (direction == 'left') {
            this.setState({playserSide: 'left'});

            Animated.spring(
                this.state.movePlayerVal,
                {
                    toValue: 40,
                    tension: 120,
                }
            ).start();
        }
    }

    componentDidMount() {
        this.animateEnemy();
    }

    animateEnemy() {
        this.state.moveEnemyVal.setValue(-100);
        var windowH = Dimensions.get('window').height;

        // generate left distance for enemy
        var r = Math.floor(Math.random() * 2) + 1;

        if (r == 2) {
            r = 40;
            this.setState({enemySide: 'left'});
        } else {
            r = Dimensions.get('window').width - 140;
            // Enemy is on right
            this.setState({enemySide: 'right'});
        }
        this.setState({ enemyStartposX: r });

        //Interval to check for collision each 50 ms
        var refreshIntervalId;
        refreshIntervalId = setInterval( () => {
            //Collision logic

            //If enemy collides with player and they are on the same side
            //-- and the enemy has not passed the player safely
            if (this.state.moveEnemyVal._value > windowH - 280 
                && this.state.moveEnemyVal._value < windowH -180
                && this.state.playserSide == this.state.enemySide) {
                    clearInterval(refreshIntervalId)
                    this.setState({ gameOver: true });
                    this.gameOver();
                }
        }, 50);

        //  Increase enemy spped
        setInterval(() => {
            this.setState({ enemySpeed: this.state.enemySpeed - 50 })
        }, 15000);

        //Animate the enemy
        Animated.timing(
            this.state.moveEnemyVal,
            {
                toValue: Dimensions.get('window').height,
                duration: this.state.enemySpeed,
            }
        ).start(event => {
            //if no collision is detected, restart the enemy amination
            if (event.finished && this.state.gameOver == false) {
                clearInterval(refreshIntervalId);
                this.setState({ points: ++this.state.points });
                this.animateEnemy();
            }
        });
    }

    gameOver() {
        alert(' You are lost!');
    }
    
    render() {
        return (
            <ImageBackground style={styles.container} source={require('./images/bg.jpg')}>
                <View style={{flex: 1, alignItems: 'center', marginTop: 80}}>
                    <View style={styles.points}>
                        <Text style={{fontWeight: 'bold', fontSize: 40}}>{this.state.points}</Text>
                    </View>
                </View>
                <Animated.Image 
                    source={require('./images/pilot_burned.png')}
                    style={{
                        height: 100,
                        width: 100,
                        position: 'absolute',   
                        zIndex: 1,
                        bottom: 50,
                        resizeMode: 'stretch',
                        transform: [
                            { translateX: this.state.movePlayerVal }
                        ]
                }}></Animated.Image>

                <Enemy 
                    enemyImg={require('./images/boom.png')}
                    enemyStartposX={this.state.enemyStartposX}
                    moveEnemyVal={this.state.moveEnemyVal}
                />

                <View style={styles.controls}>
                    <Text style={styles.left} onPress={() => this.movePlayer('left')}>{'<'}</Text>
                    <Text style={styles.right} onPress={() => this.movePlayer('right')}>{'>'}</Text>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        resizeMode: 'cover',
        width: '100%',
        height: '100%'
    },
    points: {
        width: 80,
        height: 80,
        backgroundColor:'#fff',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controls: {
            alignItems: 'center',
            flexDirection: 'row',
        },
    right: {
        flex: 1,
        color: '#ffffff',
        marginLeft: 20,
        fontSize: 120,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    left: {
        flex: 1,
        color: '#ffffff',
        fontSize: 120,
        fontWeight: 'bold',
        textAlign: 'right'
    },
});
