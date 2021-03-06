import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Dimensions
} from 'react-native';

import Drop from '../Drop';

const CIRCLE_RADIUS = 36;
const Window = Dimensions.get('window');
const { width, height} = Window;

export default class App extends Component {
    static defaultProps = {
        dropsCount: 10
    };

    constructor(props) {
        super(props);

        this.state = {
            showDraggable: true,
            dropZoneValues: null,
            pan: new Animated.ValueXY()
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, {
                dx: this.state.pan.x,
                dy: this.state.pan.y
            }]),
            onPanResponderRelease: (e, gesture) => {
                if (this.isDropZone(gesture)) {
                    this.setState({
                        showDraggable : true
                    });
                } else {
                    Animated.spring(
                        this.state.pan,
                        {
                            toValue: {
                                x: 0, y: 0
                            }
                        }).start();
                }
            }
        });
    }

    isDropZone(gesture) {
        var dz = this.state.dropZoneValues;

        return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
    }

    setDropZoneValues(event) {
        this.setState({
            dropZoneValues : event.nativeEvent.layout
        });
    }

    renderDraggable() {
        if (this.state.showDraggable) {
            return (
                <View style={styles.draggableContainer}>
                    <Animated.View
                        {...this.panResponder.panHandlers}
                        style={[this.state.pan.getLayout(), styles.circle]}>
                        <Text style={styles.text}>Drag me!</Text>
                    </Animated.View>
                </View>
            );
        }
    }

    render({ dropsCount } = this.props) {
        return (
            <View style={styles.mainContainer}>
                <View
                    onLayout={this.setDropZoneValues.bind(this)}
                    style={styles.dropZone}>
                    <Text style={styles.text}>Drop me here!</Text>
                </View>
                {[...Array(dropsCount)].map((_, index) => <Drop
                    x={Math.random() * width}               // x-coordinate
                    y={Math.random() * height}              // y-coordinate
                    radius={Math.random() * 4 + 1}          // radius
                    density={Math.random() * dropsCount}   // density
                    key={index}
                />)}

            {this.renderDraggable()}
        </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    dropZone: {
        height: 100,
        backgroundColor: '#2c3e50'
    },
    text: {
        marginTop: 25,
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
        color: '#fff'
    },
    draggableContainer: {
        position: 'absolute',
        top: Window.height / 2 - CIRCLE_RADIUS,
        left: Window.width / 2 - CIRCLE_RADIUS
    },
    circle: {
        backgroundColor: '#1abc9c',
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS
    }
});
