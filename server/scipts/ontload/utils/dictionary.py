from __future__ import division

import math

def addDict(dic1, dic2):
    """
        Merge to dicts 
        
        dict1(key: number) + dict2(key: number2) -> dict_new(key: number+ number2)
    """
    for key in dic2.keys():
        if key in dic1:
            dic1[key] += dic2[key]
        else:
            dic1[key] = dic2[key]
            
    return dic1

def normalizeLin(dic):
    '''
        Linear normalization
    '''
    length = sum(dic.values())
    if length == 0:
        return dic
    
    for id in dic:
        dic[id] /= length
        
    return dic

def normalizeGeom(dic):
    '''
        Geometric normalization
    '''
    length = math.sqrt(sum(map(lambda x: x*x, dic.values())))
    if length == 0:
        return dic
    
    for id in dic:
        dic[id] /= length
        
    return dic
    