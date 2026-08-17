import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        padding:20,
        paddingBottom:30,
        backgroundColor:'#fff'
    },
    button:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#007AFF',
        paddingVertical:12,
        paddingHorizontal:20,
        borderRadius:8,
    },
    buttonPressed:{
        opacity:0.7,
    },
    buttonText:{
        color:'#fff',
        fontSize:16,
        fontWeight:'600',
        marginLeft:8,
    },
    previewArea:{
        width:'100%',
        height:160,
        marginTop:16,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#f0f0f0',
    },
    image:{
        width:'100%',
        height:'100%',
        borderRadius:10,
    }
})

export default styles;