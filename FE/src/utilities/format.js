const formatDate = (date) => {
    try {
        date = new Date(date)
        var hours = date.getHours();
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes;
        
        var currentdate = new Date(); 
        if (date.getDate() === currentdate.getDate() 
                && (date.getMonth() === currentdate.getMonth()) 
                && (date.getFullYear() === currentdate.getFullYear()))
            return strTime
        
        
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + strTime;
    } catch (error) {
        //console.log(error)
        return date
    }
};

export { formatDate };
