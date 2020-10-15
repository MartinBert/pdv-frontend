const formatDate = async (str) => {

    let character = /-/gi;
    let firstDate = str.replace(character,'');
    firstDate = firstDate.substring(0,8);
    let year = firstDate.substring(0, 4);
    let month = firstDate.substring(4, 6);
    let day = firstDate.substring(6, 8);
    let date = day+'/'+month+'/'+year;
    return date;
    
};
formatDate();