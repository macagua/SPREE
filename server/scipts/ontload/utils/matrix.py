'''
    transpose a sparse dictionary matrix
    
    @param a_x_b: dictionary of type {row_key:{column_key:vlaue,...},...}
    
    @return: a_x_b^T
'''
def transposeDictMatrix(a_x_b):

    b_x_a = {}
    for r_key, row in a_x_b.items():
        for c_key, value in row.items():
            column = b_x_a.get(c_key,{})
            column[r_key] = value
            b_x_a[c_key] = column
            
    return b_x_a


#m = {'n1':{'a1':1,'a2':2},'n2':{'a1':3,'a4':4}}
#print transposeDictMatrix(m)
