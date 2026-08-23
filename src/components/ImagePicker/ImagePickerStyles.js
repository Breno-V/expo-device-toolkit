import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        padding:20,
        paddingBottom:30,
        backgroundColor:'#fff'
    },
    buttonRow:{
        flexDirection:'row',
        flexWrap:'wrap',
        gap:12,
    },
    button:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#16A34A',
        paddingVertical:12,
        paddingHorizontal:20,
        borderRadius:8,
        minWidth:140,
        flexGrow:1,
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
        marginTop:16,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#F0FDF4',
        padding: 8,
    },
    image:{
        width:'100%',
        borderRadius:8,
    }
})

export default styles;