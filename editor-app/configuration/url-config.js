/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
var KISBPM = KISBPM || {};

KISBPM.URL = {

    getModel: function(modelId) {
        return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/json';
    },

    getStencilSet: function() {
        // return ACTIVITI.CONFIG.contextRoot + '/editor/stencilset?version=' + Date.now();
        return './editor-app/stencilset.json'
    },

    putModel: function(modelId) {
        return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/save';
    },

    getFirm:function(){
        return ACTIVITI.CONFIG.authApi + '/base_Organization/getDepartmentInfoList';
    },

    getPeo:function(){
        return ACTIVITI.CONFIG.authApi + '/base_Organization/getCentUser';
    },

    getGrop:function(){
        return ACTIVITI.CONFIG.authApi + '/base_group/getGroupList';
        //测试
        // return ACTIVITI.CONFIG.authApi + '/base_group/getAllUserList';
    },

    getCustomList:function(){
        return ACTIVITI.CONFIG.mobile + '/form';
    },
    getNoticeapplicationList:function(){
        return ACTIVITI.CONFIG.authApi + '/base_noticeTemplate/getList';
    }
};